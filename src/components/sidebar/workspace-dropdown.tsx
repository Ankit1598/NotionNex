"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Workspace } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import WorkspaceCreator from "../global/workspace-creator";
import SelectedWorkspace from "./selected-workspace";

interface WorkspaceDropdownProps {
	privateWorkspaces: Workspace[] | [];
	sharedWorkspaces: Workspace[] | [];
	collaboratingWorkspaces: Workspace[] | [];
	defaultValue: Workspace | undefined;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
	privateWorkspaces,
	collaboratingWorkspaces,
	sharedWorkspaces,
	defaultValue
}) => {
	const { dispatch, state } = useAppState();
	const [selectedOption, setSelectedOption] = useState(defaultValue);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!state.workspaces.length) {
			dispatch({
				type: "SET_WORKSPACES",
				payload: {
					workspaces: [
						...privateWorkspaces,
						...sharedWorkspaces,
						...collaboratingWorkspaces
					].map((workspace) => ({ ...workspace, folders: [] }))
				}
			});
		}
	}, [
		privateWorkspaces,
		collaboratingWorkspaces,
		sharedWorkspaces,
		state.workspaces.length,
		dispatch
	]);

	const handleSelect = (option: Workspace) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	useEffect(() => {
		const findSelectedWorkspace = state.workspaces.find(
			(workspace) => workspace.id === defaultValue?.id
		);
		if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace);
	}, [state, defaultValue]);

	return (
		<div className='relative inline-block text-left'>
			<span onClick={() => setIsOpen(!isOpen)}>
				{selectedOption ? (
					<SelectedWorkspace workspace={selectedOption} />
				) : (
					"Select a workspace"
				)}
			</span>
			{isOpen && (
				<div className='origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-auto scrollbar border-[1px] border-muted'>
					<div className='rounded-md flex flex-col'>
						<div className='!p-2'>
							{!!privateWorkspaces.length && (
								<>
									<p className='text-muted-foreground'>
										Private
									</p>
									<hr></hr>
									{privateWorkspaces.map((workspace) => (
										<SelectedWorkspace
											key={workspace.id}
											workspace={workspace}
											onClick={handleSelect}
										/>
									))}
								</>
							)}
							{!!sharedWorkspaces.length && (
								<>
									<p className='text-muted-foreground'>
										Shared
									</p>
									<hr />
									{sharedWorkspaces.map((workspace) => (
										<SelectedWorkspace
											key={workspace.id}
											workspace={workspace}
											onClick={handleSelect}
										/>
									))}
								</>
							)}
							{!!collaboratingWorkspaces.length && (
								<>
									<p className='text-muted-foreground'>
										Collaborating
									</p>
									<hr />
									{collaboratingWorkspaces.map(
										(workspace) => (
											<SelectedWorkspace
												key={workspace.id}
												workspace={workspace}
												onClick={handleSelect}
											/>
										)
									)}
								</>
							)}
						</div>
						<CustomDialogTrigger
							header='Create A Workspace'
							content={<WorkspaceCreator />}
							description='Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too.'
						>
							<div className='flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full'>
								<article className='text-slate-500 rounded-full bg-slate-800 w-4 h-4 flex items-center justify-center'>
									+
								</article>
								Create workspace
							</div>
						</CustomDialogTrigger>
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkspaceDropdown;
